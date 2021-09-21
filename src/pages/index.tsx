import axios from "axios";
import Head from "next/head";
import React, { useEffect } from "react";
import { InputUnicorn } from "../components/InputUnicorn";
import { Unicorn } from "../models";

export default function Home() {
  const [unicorns, setUnicorns] = React.useState<Unicorn[]>([]);
  useEffect(() => {
    const fetchUnicorns = async () => {
      const { data } = await axios.get(
        "https://unicorn-api.vercel.app/api/unicorns"
      );
      setUnicorns(data);
    };
    fetchUnicorns();
  }, []);

  return (
    <div>
      <Head>
        <title>Create Unicorn App</title>
        <meta name="description" content="Generated by Netlight." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 space-y-4">
        <h1 className="text-6xl text-center">Bring your unicorn to life</h1>
        <div className="max-w-prose mx-auto">
        <InputUnicorn id="new" />
        </div>
        <h2 className="text-3xl text-center">The lively herd</h2>
        <div className="sm:grid grid-cols-4 gap-4">
        {unicorns.map(({ _id, ...rest }) => (
          <InputUnicorn key={_id} id={_id} initialState={rest} disabled />
        ))}
        </div>
      </main>
    </div>
  );
}
