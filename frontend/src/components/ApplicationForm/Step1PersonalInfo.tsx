import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, CreditCard, MapPin } from 'lucide-react';

export interface PersonalInfo {
  fullName: string;
  email: string;
  dateOfBirth: string;
  ssnLast4: string;
  address: string;
}

interface Step1Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  errors: Partial<PersonalInfo>;
}

export default function Step1PersonalInfo({ data, onChange, errors }: Step1Props) {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-gold" />
          Full Legal Name
        </Label>
        <Input
          id="fullName"
          placeholder="John Michael Smith"
          value={data.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-gold" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dob" className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            Date of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? 'border-destructive' : ''}
          />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ssn" className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-gold" />
            SSN Last 4 Digits
          </Label>
          <Input
            id="ssn"
            placeholder="XXXX"
            maxLength={4}
            value={data.ssnLast4}
            onChange={(e) => update('ssnLast4', e.target.value.replace(/\D/g, ''))}
            className={errors.ssnLast4 ? 'border-destructive' : ''}
          />
          {errors.ssnLast4 && <p className="text-xs text-destructive">{errors.ssnLast4}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          Home Address
        </Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State, ZIP"
          value={data.address}
          onChange={(e) => update('address', e.target.value)}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
        🔒 Your personal information is encrypted and protected. We use bank-level security to keep your data safe.
      </p>
    </div>
  );
}
