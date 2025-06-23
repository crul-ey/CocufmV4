"use client";

import { Badge } from "@/components/ui/badge";
import {
  shippingCalculator,
  getSupplierColor,
  formatPrice,
} from "@/lib/shipping-calculator";
import { Truck } from "lucide-react";

interface ProductSupplierBadgeProps {
  productTags: string[];
  className?: string;
  showShipping?: boolean;
}

export default function ProductSupplierBadge({
  productTags,
  className = "",
  showShipping = false,
}: ProductSupplierBadgeProps) {
  const supplier = shippingCalculator.getSupplierForProduct(productTags);

  if (!supplier) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className={getSupplierColor(supplier.color)}>
        <span className="mr-1">{supplier.icon}</span>
        {supplier.name}
      </Badge>

      {showShipping && (
        <div className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
          <Truck className="w-3 h-3" />
          <span>vanaf {formatPrice(supplier.shippingRule.baseRate)}</span>
        </div>
      )}
    </div>
  );
}
