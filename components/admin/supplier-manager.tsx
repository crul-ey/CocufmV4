"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building2,
  Truck,
  Euro,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  shippingCalculator,
  type SupplierConfig,
  formatPrice,
  getSupplierColor,
} from "@/lib/shipping-calculator";

export default function SupplierManager() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<SupplierConfig[]>(
    shippingCalculator.getActiveSuppliers()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SupplierConfig>>({});

  const handleEdit = (supplier: SupplierConfig) => {
    setEditingId(supplier.id);
    setFormData(supplier);
  };

  const handleSave = () => {
    if (!formData.id) return;

    const success = shippingCalculator.updateSupplier(
      formData.id,
      formData as SupplierConfig
    );

    if (success) {
      setSuppliers(shippingCalculator.getActiveSuppliers());
      setEditingId(null);
      setFormData({});
      toast({
        title: "✅ Leverancier bijgewerkt!",
        description: "De wijzigingen zijn succesvol opgeslagen.",
        variant: "success",
      });
    } else {
      toast({
        title: "❌ Fout bij opslaan",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    if (!formData.name || !formData.tag || !formData.shippingRule) return;

    const newSupplier: SupplierConfig = {
      id: `supplier-${Date.now()}`,
      name: formData.name,
      tag: formData.tag,
      color: formData.color || "blue",
      icon: formData.icon || "📦",
      shippingRule: {
        id: `rule-${Date.now()}`,
        name: formData.shippingRule.name || `${formData.name} Verzending`,
        description:
          formData.shippingRule.description || "Standaard verzending",
        baseRate: formData.shippingRule.baseRate || 5.0,
        additionalRate: formData.shippingRule.additionalRate || 1.0,
        freeShippingThreshold:
          formData.shippingRule.freeShippingThreshold || 50.0,
        countries: formData.shippingRule.countries || ["NL"],
        active: true,
      },
    };

    shippingCalculator.addSupplier(newSupplier);
    setSuppliers(shippingCalculator.getActiveSuppliers());
    setShowAddForm(false);
    setFormData({});

    toast({
      title: "🎉 Nieuwe leverancier toegevoegd!",
      description: `${newSupplier.name} is succesvol toegevoegd.`,
      variant: "success",
    });
  };

  const handleDelete = (supplierId: string) => {
    const confirmed = window.confirm(
      "Weet je zeker dat je deze leverancier wilt verwijderen?"
    );
    if (!confirmed) return;

    const success = shippingCalculator.removeSupplier(supplierId);

    if (success) {
      setSuppliers(shippingCalculator.getActiveSuppliers());
      toast({
        title: "🗑️ Leverancier verwijderd",
        description: "De leverancier is succesvol verwijderd.",
        variant: "success",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Leveranciers Beheer
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Beheer je leveranciers en hun verzendkosten
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Leverancier
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Nieuwe Leverancier Toevoegen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Leverancier Naam</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Bijv. Premium Lifestyle"
                />
              </div>
              <div>
                <Label htmlFor="tag">Shopify Tag</Label>
                <Input
                  id="tag"
                  value={formData.tag || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  placeholder="Bijv. supplier-premium"
                />
              </div>
              <div>
                <Label htmlFor="icon">Emoji Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="📦"
                />
              </div>
              <div>
                <Label htmlFor="color">Kleur</Label>
                <select
                  id="color"
                  value={formData.color || "blue"}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800"
                >
                  <option value="blue">Blauw</option>
                  <option value="green">Groen</option>
                  <option value="purple">Paars</option>
                  <option value="orange">Oranje</option>
                  <option value="red">Rood</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Verzendkosten Instellingen</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="baseRate">Basis Tarief (€)</Label>
                  <Input
                    id="baseRate"
                    type="number"
                    step="0.01"
                    value={formData.shippingRule?.baseRate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingRule: {
                          ...formData.shippingRule,
                          baseRate: Number.parseFloat(e.target.value) || 0,
                        } as any,
                      })
                    }
                    placeholder="7.90"
                  />
                </div>
                <div>
                  <Label htmlFor="additionalRate">Extra Item (€)</Label>
                  <Input
                    id="additionalRate"
                    type="number"
                    step="0.01"
                    value={formData.shippingRule?.additionalRate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingRule: {
                          ...formData.shippingRule,
                          additionalRate:
                            Number.parseFloat(e.target.value) || 0,
                        } as any,
                      })
                    }
                    placeholder="1.00"
                  />
                </div>
                <div>
                  <Label htmlFor="freeThreshold">Gratis vanaf (€)</Label>
                  <Input
                    id="freeThreshold"
                    type="number"
                    step="0.01"
                    value={formData.shippingRule?.freeShippingThreshold || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingRule: {
                          ...formData.shippingRule,
                          freeShippingThreshold:
                            Number.parseFloat(e.target.value) || 0,
                        } as any,
                      })
                    }
                    placeholder="75.00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={formData.shippingRule?.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingRule: {
                        ...formData.shippingRule,
                        description: e.target.value,
                      } as any,
                    })
                  }
                  placeholder="Snelle levering binnen 1-2 werkdagen"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Opslaan
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suppliers List */}
      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{supplier.icon}</span>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {editingId === supplier.id ? (
                        <Input
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="text-lg font-bold"
                        />
                      ) : (
                        supplier.name
                      )}
                      <Badge className={getSupplierColor(supplier.color)}>
                        {supplier.tag}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {supplier.shippingRule.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === supplier.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(supplier)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Basis Tarief
                    </div>
                    <div className="font-semibold">
                      {editingId === supplier.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.shippingRule?.baseRate || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingRule: {
                                ...formData.shippingRule,
                                baseRate:
                                  Number.parseFloat(e.target.value) || 0,
                              } as any,
                            })
                          }
                        />
                      ) : (
                        formatPrice(supplier.shippingRule.baseRate)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Extra Item
                    </div>
                    <div className="font-semibold">
                      {editingId === supplier.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.shippingRule?.additionalRate || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingRule: {
                                ...formData.shippingRule,
                                additionalRate:
                                  Number.parseFloat(e.target.value) || 0,
                              } as any,
                            })
                          }
                        />
                      ) : (
                        formatPrice(supplier.shippingRule.additionalRate)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Gratis vanaf
                    </div>
                    <div className="font-semibold">
                      {editingId === supplier.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={
                            formData.shippingRule?.freeShippingThreshold || ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingRule: {
                                ...formData.shippingRule,
                                freeShippingThreshold:
                                  Number.parseFloat(e.target.value) || 0,
                              } as any,
                            })
                          }
                        />
                      ) : (
                        formatPrice(supplier.shippingRule.freeShippingThreshold)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Status
                    </div>
                    <div className="font-semibold">
                      {supplier.shippingRule.active ? (
                        <Badge className="bg-green-100 text-green-800">
                          Actief
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Inactief
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Geen leveranciers gevonden
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              Voeg je eerste leverancier toe om te beginnen.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Eerste Leverancier Toevoegen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
