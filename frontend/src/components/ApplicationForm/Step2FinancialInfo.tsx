import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Briefcase, TrendingUp } from 'lucide-react';

export interface FinancialInfo {
  annualIncome: string;
  employmentStatus: string;
  creditScoreRange: string;
}

interface Step2Props {
  data: FinancialInfo;
  onChange: (data: FinancialInfo) => void;
  errors: Partial<FinancialInfo>;
}

const employmentOptions = [
  { value: 'full_time', label: 'Full-Time Employed' },
  { value: 'part_time', label: 'Part-Time Employed' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
];

const creditScoreOptions = [
  { value: '300', label: 'Poor (300–579)' },
  { value: '580', label: 'Fair (580–669)' },
  { value: '670', label: 'Good (670–739)' },
  { value: '740', label: 'Very Good (740–799)' },
  { value: '800', label: 'Exceptional (800–850)' },
];

export default function Step2FinancialInfo({ data, onChange, errors }: Step2Props) {
  const update = (field: keyof FinancialInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="annualIncome" className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-gold" />
          Annual Income (USD)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
          <Input
            id="annualIncome"
            type="number"
            placeholder="75000"
            min="0"
            value={data.annualIncome}
            onChange={(e) => update('annualIncome', e.target.value)}
            className={`pl-7 ${errors.annualIncome ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.annualIncome && <p className="text-xs text-destructive">{errors.annualIncome}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-gold" />
          Employment Status
        </Label>
        <Select value={data.employmentStatus} onValueChange={(v) => update('employmentStatus', v)}>
          <SelectTrigger className={errors.employmentStatus ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select employment status" />
          </SelectTrigger>
          <SelectContent>
            {employmentOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.employmentStatus && <p className="text-xs text-destructive">{errors.employmentStatus}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-gold" />
          Credit Score Range
        </Label>
        <Select value={data.creditScoreRange} onValueChange={(v) => update('creditScoreRange', v)}>
          <SelectTrigger className={errors.creditScoreRange ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select your credit score range" />
          </SelectTrigger>
          <SelectContent>
            {creditScoreOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.creditScoreRange && <p className="text-xs text-destructive">{errors.creditScoreRange}</p>}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <strong>Note:</strong> Your credit score range helps us match you with the best loan products. A soft credit check may be performed which does not affect your credit score.
      </div>
    </div>
  );
}
