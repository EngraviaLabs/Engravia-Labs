'use client';
import AdminShell from '../../../components/AdminShell';
import ProductForm from '../../../components/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <AdminShell>
      <ProductForm productId={params.id} />
    </AdminShell>
  );
}
