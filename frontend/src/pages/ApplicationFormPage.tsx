import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetBorrowerByPrincipal, useRegisterBorrower, useSubmitApplication } from '@/hooks/useQueries';
import { BorrowerProfile, LoanApplication, ApplicationStatus } from '@/backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Step1PersonalInfo, { PersonalInfo } from '@/components/ApplicationForm/Step1PersonalInfo';
import Step2FinancialInfo, { FinancialInfo } from '@/components/ApplicationForm/Step2FinancialInfo';
import Step3LoanDetails, { LoanDetails } from '@/components/ApplicationForm/Step3LoanDetails';
import Step4Review from '@/components/ApplicationForm/Step4Review';

const STEPS = ['Personal Info', 'Financial Info', 'Loan Details', 'Review'];

function validatePersonalInfo(data: PersonalInfo): Partial<PersonalInfo> {
  const errors: Partial<PersonalInfo> = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!data.ssnLast4.trim()) errors.ssnLast4 = 'SSN last 4 digits required';
  else if (!/^\d{4}$/.test(data.ssnLast4)) errors.ssnLast4 = 'Must be exactly 4 digits';
  if (!data.address.trim()) errors.address = 'Address is required';
  return errors;
}

function validateFinancialInfo(data: FinancialInfo): Partial<FinancialInfo> {
  const errors: Partial<FinancialInfo> = {};
  if (!data.annualIncome) errors.annualIncome = 'Annual income is required';
  else if (parseFloat(data.annualIncome) <= 0) errors.annualIncome = 'Income must be greater than 0';
  if (!data.employmentStatus) errors.employmentStatus = 'Employment status is required';
  if (!data.creditScoreRange) errors.creditScoreRange = 'Credit score range is required';
  return errors;
}

function validateLoanDetails(data: LoanDetails): Partial<LoanDetails> {
  const errors: Partial<LoanDetails> = {};
  if (!data.requestedAmount) errors.requestedAmount = 'Requested amount is required';
  else {
    const amount = parseFloat(data.requestedAmount);
    if (isNaN(amount) || amount <= 0) errors.requestedAmount = 'Please enter a valid amount greater than 0';
  }
  if (!data.termMonths) errors.termMonths = 'Loan term is required';
  else {
    const term = parseInt(data.termMonths, 10);
    if (isNaN(term) || term < 1) errors.termMonths = 'Term must be at least 1 month';
  }
  if (!data.purpose.trim()) errors.purpose = 'Loan purpose is required';
  return errors;
}

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  const { data: borrowerProfile, isLoading: profileLoading } = useGetBorrowerByPrincipal(principal);
  const registerBorrower = useRegisterBorrower();
  const submitApplication = useSubmitApplication();

  const [step, setStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    dateOfBirth: '',
    ssnLast4: '',
    address: '',
  });
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    annualIncome: '',
    employmentStatus: '',
    creditScoreRange: '',
  });
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    requestedAmount: '',
    termMonths: '',
    purpose: '',
  });
  const [personalErrors, setPersonalErrors] = useState<Partial<PersonalInfo>>({});
  const [financialErrors, setFinancialErrors] = useState<Partial<FinancialInfo>>({});
  const [loanErrors, setLoanErrors] = useState<Partial<LoanDetails>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = registerBorrower.isPending || submitApplication.isPending;

  const handleNext = () => {
    if (step === 0) {
      const errs = validatePersonalInfo(personalInfo);
      setPersonalErrors(errs);
      if (Object.keys(errs).length > 0) return;
    } else if (step === 1) {
      const errs = validateFinancialInfo(financialInfo);
      setFinancialErrors(errs);
      if (Object.keys(errs).length > 0) return;
    } else if (step === 2) {
      const errs = validateLoanDetails(loanDetails);
      setLoanErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!identity) return;
    setSubmitError(null);

    try {
      const { Principal } = await import('@dfinity/principal');
      const callerPrincipal = Principal.fromText(identity.getPrincipal().toString());

      let borrowerId: string;

      if (borrowerProfile) {
        borrowerId = borrowerProfile.id;
      } else {
        borrowerId = `borrower-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const creditScoreNum = parseInt(financialInfo.creditScoreRange, 10);
        const annualIncomeNum = parseFloat(financialInfo.annualIncome);

        const newProfile: BorrowerProfile = {
          id: borrowerId,
          principal: callerPrincipal,
          fullName: personalInfo.fullName,
          email: personalInfo.email,
          ssn: personalInfo.ssnLast4,
          annualIncome: isNaN(annualIncomeNum) ? BigInt(0) : BigInt(Math.round(annualIncomeNum)),
          creditScore: isNaN(creditScoreNum) ? BigInt(0) : BigInt(creditScoreNum),
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        };
        await registerBorrower.mutateAsync({ id: borrowerId, profile: newProfile });
      }

      const appId = `app-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const application: LoanApplication = {
        id: appId,
        borrowerId,
        requestedAmount: BigInt(Math.round(parseFloat(loanDetails.requestedAmount))),
        termMonths: BigInt(parseInt(loanDetails.termMonths, 10)),
        purpose: loanDetails.purpose,
        status: ApplicationStatus.pending,
        submittedAt: BigInt(Date.now()) * BigInt(1_000_000),
        reviewedAt: undefined,
        adminNotes: undefined,
        // productId intentionally omitted — it is optional in the backend interface
      };

      await submitApplication.mutateAsync(application);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setSubmitError(message);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Your loan application has been submitted successfully. You can track its status in your dashboard.
            </p>
            <Button className="w-full mt-4" onClick={() => navigate({ to: '/dashboard' })}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Loan Application</h1>
          <p className="text-muted-foreground">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>

        {/* Progress */}
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />

        {/* Step Indicators */}
        <div className="flex justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  i === step ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
            <CardDescription>
              {step === 0 && 'Please provide your personal information.'}
              {step === 1 && 'Tell us about your financial situation.'}
              {step === 2 && 'Specify the loan amount and purpose.'}
              {step === 3 && 'Review your application before submitting.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <Step1PersonalInfo
                data={personalInfo}
                onChange={setPersonalInfo}
                errors={personalErrors}
              />
            )}
            {step === 1 && (
              <Step2FinancialInfo
                data={financialInfo}
                onChange={setFinancialInfo}
                errors={financialErrors}
              />
            )}
            {step === 2 && (
              <Step3LoanDetails
                data={loanDetails}
                onChange={setLoanDetails}
                errors={loanErrors}
              />
            )}
            {step === 3 && (
              <Step4Review
                personalInfo={personalInfo}
                financialInfo={financialInfo}
                loanDetails={loanDetails}
              />
            )}

            {submitError && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={step === 0 ? () => navigate({ to: '/' }) : handleBack}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
