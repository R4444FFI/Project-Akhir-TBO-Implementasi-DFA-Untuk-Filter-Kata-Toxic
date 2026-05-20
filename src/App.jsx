import React from "react";

export default function DFASimulation() {
  const defaultToxicWords = ["tolol", "bodoh", "anjing"];

  const [inputWord, setInputWord] = React.useState("");
  const [detectedWord, setDetectedWord] = React.useState("");
  const [states, setStates] = React.useState(["q0"]);
  const [currentState, setCurrentState] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [speed, setSpeed] = React.useState(1000);

  const startSimulation = () => {
    setCurrentState(0);
    setCurrentText("");
    setResult("");
    setDetectedWord("");
    setHistory([]);

    const foundWord = defaultToxicWords.find((word) =>
      inputWord.toLowerCase().includes(word)
    );

    if (!foundWord) {
      setStates(["q0"]);
      setResult("Tidak ada kata toxic terdeteksi");
      return;
    }

    setDetectedWord(foundWord);

    const generatedStates = ["q0"];

    for (let i = 0; i < foundWord.length; i++) {
      if (i === foundWord.length - 1) {
        generatedStates.push("qf");
      } else {
        generatedStates.push(`q${i + 1}`);
      }
    }

    setStates(generatedStates);
    setRunning(true);

    let index = 0;

    const interval = setInterval(() => {
      if (index < foundWord.length) {
        const currentChar = foundWord[index];

        setCurrentState(index + 1);

        setCurrentText((prev) => prev + currentChar);

        setHistory((prev) => [
          ...prev,
          `${index === 0 ? "q0" : `q${index}`} membaca '${currentChar}' → ${
            index === foundWord.length - 1 ? "qf" : `q${index + 1}`
          }`,
        ]);

        index++;
      } else {
        clearInterval(interval);

        setResult(
          `Kata toxic terdeteksi → ${"*".repeat(foundWord.length)}`
        );

        setRunning(false);
      }
    }, speed);
  };

  const resetSimulation = () => {
    setInputWord("");
    setDetectedWord("");
    setStates(["q0"]);
    setCurrentState(0);
    setCurrentText("");
    setResult("");
    setRunning(false);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-10">
        Simulasi DFA Filter Kata Toxic
      </h1>

      <div className="bg-slate-800/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-7xl mx-auto border border-slate-700">

        {/* INPUT */}
        <div className="mb-8">
          <label className="block text-2xl font-semibold mb-4">
            Masukkan Kalimat
          </label>

          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Contoh: dasar anjing banget"
            className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-600 text-white text-lg focus:outline-none focus:border-green-400"
          />
        </div>

        {/* SPEED */}
        <div className="mb-10">
          <label className="text-lg mr-3">
            Kecepatan Simulasi
          </label>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-slate-900 border border-slate-600 px-4 py-2 rounded-xl"
          >
            <option value={500}>Cepat</option>
            <option value={1000}>Sedang</option>
            <option value={2000}>Lambat</option>
          </select>
        </div>

        {/* VISUAL DFA */}
        <h2 className="text-4xl font-bold mb-10 text-center">
          Visualisasi State DFA
        </h2>

        <div className="overflow-x-auto py-6">
          <div className="flex items-center justify-center min-w-max px-4">

            {states.map((state, index) => (
              <React.Fragment key={state}>

                {/* NODE */}
                <div className="flex flex-col items-center">

                  <div
                    className={`
                      w-24 h-24 rounded-full flex items-center justify-center
                      text-3xl font-bold border-4 transition-all duration-500
                      shadow-lg
                      ${
                        currentState === index
                          ? "bg-green-500 border-green-300 scale-110 shadow-green-500/50"
                          : state === "qf"
                          ? "bg-red-500 border-red-300"
                          : "bg-slate-700 border-slate-400"
                      }
                    `}
                  >
                    {state}
                  </div>

                  <div className="mt-3 text-sm text-gray-300">
                    {index === 0
                      ? "Start"
                      : state === "qf"
                      ? "Final State"
                      : "State"}
                  </div>
                </div>

                {/* ARROW */}
                {index < states.length - 1 && (
                  <div className="flex items-center mx-4">

                    <div
                      className={`
                        w-20 h-1 rounded transition-all duration-500
                        ${
                          currentState > index
                            ? "bg-green-400"
                            : "bg-gray-500"
                        }
                      `}
                    ></div>

                    <div
                      className={`
                        text-4xl -ml-1 transition-all duration-500
                        ${
                          currentState > index
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      `}
                    >
                      →
                    </div>

                  </div>
                )}

              </React.Fragment>
            ))}

          </div>
        </div>

        {/* CHARACTER */}
        <div className="text-center mt-12">
          <h2 className="text-4xl font-bold mb-5">
            Karakter Sedang Dibaca
          </h2>

          <div className="text-5xl font-bold text-green-400 tracking-widest">
            {currentText || "-"}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center gap-6 mt-12">

          <button
            onClick={startSimulation}
            disabled={running}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-bold transition"
          >
            {running ? "Simulasi Berjalan..." : "Mulai Simulasi"}
          </button>

          <button
            onClick={resetSimulation}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-xl font-bold transition"
          >
            Reset
          </button>

        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-12 text-center">

            <h2 className="text-4xl font-bold mb-4">
              Hasil Simulasi
            </h2>

            <div className="text-3xl font-bold text-yellow-400">
              {result}
            </div>

          </div>
        )}

        {/* HISTORY */}
        <div className="mt-16">

          <h2 className="text-3xl font-bold mb-6">
            Riwayat Perpindahan State
          </h2>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 max-h-80 overflow-y-auto">

            {history.length === 0 ? (
              <p className="text-gray-400">
                Belum ada proses DFA
              </p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="mb-3 text-lg border-b border-slate-700 pb-2"
                >
                  {item}
                </div>
              ))
            )}

          </div>
        </div>

        {/* STATISTIK */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">

          <div className="bg-slate-900 rounded-2xl p-6 text-center border border-slate-700">
            <h3 className="text-2xl font-bold mb-2">
              Jumlah State
            </h3>

            <p className="text-4xl text-green-400 font-bold">
              {states.length}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-center border border-slate-700">
            <h3 className="text-2xl font-bold mb-2">
              Kata Toxic
            </h3>

            <p className="text-4xl text-red-400 font-bold">
              {detectedWord || "-"}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-center border border-slate-700">
            <h3 className="text-2xl font-bold mb-2">
              Final State
            </h3>

            <p className="text-4xl text-yellow-400 font-bold">
              qf
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}