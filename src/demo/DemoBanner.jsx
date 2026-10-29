import { resetDemo } from "./mockServer";

// Thin strip shown on every page of the browser demo.
export default function DemoBanner() {
  function reset() {
    if (!window.confirm("Reset the demo? All bookings, visitors and changes made in this browser will be cleared.")) return;
    resetDemo();
    window.location.href = "/";
  }
  return (
    <div className="demo-banner">
      <span>
        <strong>Interactive demo</strong> of the COMP-EX 2027 platform by Hayat Computers &amp; Security Solutions for VCMDWA ·
        data is saved only in this browser · Admin: <a href="/admin/login">admin@vcmdwa.org / Compex@2027</a>
      </span>
      <button type="button" onClick={reset}>Reset demo</button>
    </div>
  );
}
