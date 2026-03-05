import Logo from "../components/Logo";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center flex items-center justify-center mb-8">
          <Logo />
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
