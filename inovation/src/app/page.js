import Link from "next/link";

function First() {
  return (
    <div>
      <h1>First</h1>
      <Link href={"test"}>Second へ</Link>
    </div>
  );
}

export default First;