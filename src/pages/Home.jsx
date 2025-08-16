export default function Home() {
  return (
    <section className="card">
      <h2>Home</h2>
      <p>Alur: <b>Home → Live & Capture → Result</b>.</p>
      <ul>
        <li>Page 2 (Live): <b>harus Capture dulu</b> baru tombol Next bisa dipencet.</li>
        <li>Countdown setelah pencet Capture: <b>5 · 3 · 2 · 1</b> lalu jepret.</li>
        <li>Hasil tampil di frame yang sama; tombol berubah menjadi <b>Retake</b>.</li>
        <li>Live auto ON saat masuk Page 2, auto OFF saat masuk Page 3.</li>
      </ul>
      <p className="small"> Pastikan Port Webserver aktif di <code>localhost:5513</code>.</p>
    </section>
  );
}