import { formatCurrency } from '../../lib/formatters';

interface PriceTextProps {
  amount: number;
  className?: string;
  showSign?: boolean;
}

export function PriceText({ amount, className = '', showSign = false }: PriceTextProps) {
  const isNegative = amount < 0;
  const displayAmount = Math.abs(amount);

  return (
    <span className={className}>
      {showSign && !isNegative && '+'}{isNegative && '-'}{formatCurrency(displayAmount)}
    </span>
  );
}
