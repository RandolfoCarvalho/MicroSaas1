import PaymentForm from '../components/PaymentForm';

export default function PaymentPage() {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Pagamento via PIX</h2>
        <PaymentForm />
      </div>
    );
  }
