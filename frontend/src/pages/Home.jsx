import Navbar from '../components/Navbar';

export default function Home() {
  const products = [
    { id: 1, name: 'Product 1', price: '$10' },
    { id: 2, name: 'Product 2', price: '$20' },
    { id: 3, name: 'Product 3', price: '$30' },
    { id: 4, name: 'Product 3', price: '$30' },
    { id: 5, name: 'Product 3', price: '$30' },
    { id: 6, name: 'Product 3', price: '$30' },
    { id: 7, name: 'Product 3', price: '$30' },
    { id: 8, name: 'Product 3', price: '$30' },
  ];

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
    </div>
  );
}