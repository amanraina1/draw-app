"use client";

export default function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-4 m-2 bg-white rounded-2xl">
        <div className="p-2">
          <input type="text" placeholder="Email" />
        </div>

        <div className="p-2">
          <input type="password" placeholder="Password" />
        </div>
        <div className="pt-2">
          <button>{isSignIn ? "Sign in" : "Sign up"}</button>
        </div>
      </div>
    </div>
  );
}
