import { PersonalInfo } from './Step1PersonalInfo';
import { FinancialInfo } from './Step2FinancialInfo';
import { LoanDetails } from './Step3LoanDetails';
import { Separator } from '@/components/ui/separator';
import { User, DollarSign, FileText, CheckCircle } from 'lucide-react';

interface Step4ReviewProps {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
}

function formatCurrency(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

const employmentLabels: Record<string, string> = {
  full_time: 'Full-Time Employed',
  part_time: 'Part-Time Employed',
  self_employed: 'Self-Employed',
  unemployed: 'Unemployed',
  retired: 'Retired',
  student: 'Student',
};

const creditScoreLabels: Record<string, string> = {
  '300': 'Poor (300–579)',
  '580': 'Fair (580–669)',
  '670': 'Good (670–739)',
  '740': 'Very Good (740–799)',
  '800': 'Exceptional (800–850)',
};

export default function Step4Review({ personalInfo, financialInfo, loanDetails }: Step4ReviewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-700">
          Please review your information carefully before submitting.
        </p>
      </div>

      {/* Personal Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gold" />
          <h4 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Personal Information
          </h4>
        </div>
        <div className="bg-secondary rounded-lg px-4 py-2 space-y-0.5">
          <ReviewRow label="Full Name" value={personalInfo.fullName} />
          <ReviewRow label="Email" value={personalInfo.email} />
          <ReviewRow label="Date of Birth" value={personalInfo.dateOfBirth} />
          <ReviewRow label="SSN Last 4" value={`••••${personalInfo.ssnLast4}`} />
          <ReviewRow label="Address" value={personalInfo.address} />
        </div>
      </div>

      <Separator />

      {/* Financial Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gold" />
          <h4 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Financial Information
          </h4>
        </div>
        <div className="bg-secondary rounded-lg px-4 py-2 space-y-0.5">
          <ReviewRow
            label="Annual Income"
            value={formatCurrency(financialInfo.annualIncome)}
          />
          <ReviewRow
            label="Employment"
            value={
              employmentLabels[financialInfo.employmentStatus] || financialInfo.employmentStatus
            }
          />
          <ReviewRow
            label="Credit Score"
            value={
              creditScoreLabels[financialInfo.creditScoreRange] || financialInfo.creditScoreRange
            }
          />
        </div>
      </div>

      <Separator />

      {/* Loan Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gold" />
          <h4 className="text-sm font-semibold text-navy uppercase tracking-wide">Loan Details</h4>
        </div>
        <div className="bg-secondary rounded-lg px-4 py-2 space-y-0.5">
          <ReviewRow
            label="Requested Amount"
            value={formatCurrency(loanDetails.requestedAmount)}
          />
          <ReviewRow label="Term" value={`${loanDetails.termMonths} months`} />
          <ReviewRow label="Purpose" value={loanDetails.purpose} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        By submitting this application, you authorize LendBridge USA to verify your information and
        perform a credit check. This application does not guarantee loan approval.
      </p>
    </div>
  );
}
