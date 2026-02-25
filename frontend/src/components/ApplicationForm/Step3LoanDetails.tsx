import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Clock, FileText } from 'lucide-react';

export interface LoanDetails {
  requestedAmount: string;
  termMonths: string;
  purpose: string;
}

interface Step3Props {
  data: LoanDetails;
  onChange: (data: LoanDetails) => void;
  errors: Partial<LoanDetails>;
}

export default function Step3LoanDetails({ data, onChange, errors }: Step3Props) {
  const update = (field: keyof LoanDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="requestedAmount" className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-gold" />
          Requested Amount (USD)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <Input
            id="requestedAmount"
            type="number"
            placeholder="Enter amount"
            min={0}
            value={data.requestedAmount}
            onChange={(e) => update('requestedAmount', e.target.value)}
            className={`pl-7 ${errors.requestedAmount ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.requestedAmount && (
          <p className="text-xs text-destructive">{errors.requestedAmount}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="termMonths" className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-gold" />
          Loan Term (Months)
        </Label>
        <Input
          id="termMonths"
          type="number"
          placeholder="12"
          min="1"
          value={data.termMonths}
          onChange={(e) => update('termMonths', e.target.value)}
          className={errors.termMonths ? 'border-destructive' : ''}
        />
        {errors.termMonths && <p className="text-xs text-destructive">{errors.termMonths}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purpose" className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-gold" />
          Loan Purpose
        </Label>
        <Textarea
          id="purpose"
          placeholder="Describe how you plan to use this loan (e.g., home renovation, debt consolidation, medical expenses)..."
          value={data.purpose}
          onChange={(e) => update('purpose', e.target.value)}
          rows={3}
          className={errors.purpose ? 'border-destructive' : ''}
        />
        {errors.purpose && <p className="text-xs text-destructive">{errors.purpose}</p>}
      </div>
    </div>
  );
}
