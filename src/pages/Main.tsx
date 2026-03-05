import Header from "../components/Header";
import useUser from "../hooks/useUser";

import ProductsTable from "../components/ProductsTable";

const Main = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Список изделий</h1>

        <div className="bg-white rounded-2xl shadow p-4">
          <ProductsTable />
        </div>
      </div>
    </div>
  );
};

export default Main;
