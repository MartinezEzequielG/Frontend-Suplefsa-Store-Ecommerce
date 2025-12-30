export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Contacto</h1>
      <p className="text-sm text-zinc-600 mb-6">Escribinos y te respondemos a la brevedad.</p>
      <form className="grid gap-3 bg-white border rounded p-4">
        <input name="name" placeholder="Nombre" className="border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2" />
        <textarea name="message" placeholder="Mensaje" className="border rounded px-3 py-2" rows={5} />
        <button type="submit" className="rounded bg-black text-white px-4 py-2 text-sm">Enviar</button>
      </form>
    </main>
  );
}