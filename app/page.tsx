"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type EmployeeRow = {
  id: number | string;
  created_at: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  date_of_joining: string | null;
  status: string | null;
  mobile: string | null;
};

export default function Page() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrorMsg(null);

      // Map quoted Postgres column names -> JS-friendly aliases
      // syntax: alias:"Quoted Column Name"
      const { data, error } = await supabase
        .from("Employee")
        .select(
          [
            "id",
            "created_at",
            'first_name:"First name"',
            'last_name:"Last name"',
            'email:"Email ID"',
            'date_of_joining:"Date of Joining"',
            "status:Status",
            'mobile:"Mobile number"',
          ].join(", ")
        )
        .order("id", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setRows((data as EmployeeRow[]) ?? []);
      }
      setLoading(false);
    };

    run();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">👨‍💼 Employees</h1>

      {loading && <p>Loading…</p>}
      {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}

      {!loading && !errorMsg && (
        <>
          {rows.length === 0 ? (
            <p className="text-gray-500">No employees found.</p>
          ) : (
            <div className="overflow-x-auto border rounded">
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">First name</th>
                    <th className="p-2 border">Last name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Mobile</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date of Joining</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={String(r.id)}>
                      <td className="p-2 border">{r.id}</td>
                      <td className="p-2 border">{r.first_name ?? ""}</td>
                      <td className="p-2 border">{r.last_name ?? ""}</td>
                      <td className="p-2 border">{r.email ?? ""}</td>
                      <td className="p-2 border">{r.mobile ?? ""}</td>
                      <td className="p-2 border">{r.status ?? ""}</td>
                      <td className="p-2 border">
                        {r.date_of_joining
                          ? new Date(r.date_of_joining).toLocaleDateString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
