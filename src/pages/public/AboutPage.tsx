export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-slate-900 dark:text-slate-100">
      <h1 className="mb-6 text-4xl font-bold">Про ПродажPro</h1>
      <div className="prose prose-lg">
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          ПродажPro – це сучасна система управління продажами, розроблена спеціально для
          оптово-роздрібних компаній в Україні.
        </p>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          Наша платформа допомагає автоматизувати облік товарів, управління покупцями,
          створення угод, налаштування знижок та отримання фінансової аналітики.
        </p>
        <h2 className="mt-8 mb-4 text-2xl font-bold">Наша місія</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Зробити управління продажами простим, зрозумілим та ефективним для бізнесу
          будь-якого масштабу.
        </p>
      </div>
    </div>
  );
}
