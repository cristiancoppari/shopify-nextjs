import { Truck, CreditCard, Globe } from "lucide-react";

export function BenefitsSection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold uppercase">Envio gratis</h3>
          <p className="text-sm text-muted-foreground">En compras superiores a $150.000</p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-2">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold uppercase">12 cuotas sin interés</h3>
          <p className="text-sm text-muted-foreground">hasta el Domingo 10/11</p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold uppercase">Comprá de manera segura</h3>
          <p className="text-sm text-muted-foreground">Protegemos tus datos</p>
        </div>
      </div>
    </div>
  );
}
