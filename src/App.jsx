import React from "react";

export default function DFASimulation() {

  // daftar kata toxic
  const defaultToxicWords = ["tolol", "bodoh", "anjing", "anj", "bgsd", "bgst", "anj", "bangsad", "bangsat", "ajg"];

  // state react
  const [inputWord, setInputWord] = React.useState("");
  const [detectedWord, setDetectedWord] = React.useState("");
  const [states, setStates] = React.useState(["q0"]);
  const [currentState, setCurrentState] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [speed, setSpeed] = React.useState(1000);

  // mulai simulasi
  const startSimulation = () => {

    // reset state
    setCurrentState(0);
    setCurrentText("");
    setResult("");
    setDetectedWord("");
    setHistory([]);

    // cari kata toxic
    const foundWord = defaultToxicWords.find((word) =>
      inputWord.toLowerCase().includes(word)
    );

    // jika tidak ada toxic
    if (!foundWord) {
      setStates(["q0"]);
      setResult("Tidak ada kata toxic terdeteksi");
      return;
    }

    setDetectedWord(foundWord);

    // generate state DFA
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

        // update state
        setCurrentState(index + 1);

        // tampil karakter
        setCurrentText((prev) => prev + currentChar);

        // tambah history
        setHistory((prev) => [
          ...prev,
          `${index === 0 ? "q0" : `q${index}`} membaca '${currentChar}'
           → ${index === foundWord.length - 1
              ? "qf"
              : `q${index + 1}`}`
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

  // reset simulasi
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

    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">

      {/* JUDUL */}
      <h1 className="text-5xl font-bold mb-8 text-center">
        Simulasi DFA Filter Kata Toxic
      </h1>

      {/* CONTAINER */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl">

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
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500"
          />

        </div>

        {/* SPEED CONTROL */}
        <div className="mb-10">

          <label className="block text-xl font-semibold mb-3">
            Kecepatan Simulasi
          </label>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="border-2 border-gray-300 rounded-lg px-4 py-2"
          >
            <option value={500}>Cepat</option>
            <option value={1000}>Sedang</option>
            <option value={2000}>Lambat</option>
          </select>

        </div>

        {/* VISUALISASI STATE */}
        <div className="mb-12">

          <h2 className="text-3xl font-bold text-center mb-8">
            Visualisasi State DFA
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-4">

            {states.map((state, index) => (

              <React.Fragment key={index}>

                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-4 transition-all duration-500 ${
                    currentState === index
                      ? "bg-green-500 text-white border-green-700 scale-110 animate-pulse"
                      : state === "qf"
                      ? "bg-red-500 text-white border-red-700"
                      : "bg-gray-200 border-gray-400"
                  }`}
                >
                  {state}
                </div>

                {index !== states.length - 1 && (
                  <div
                    className={`text-4xl font-bold ${
                      currentState === index + 1
                        ? "text-green-600"
                        : "text-black"
                    }`}
                  >
                    →
                  </div>
                )}

              </React.Fragment>

            ))}

          </div>

        </div>

        {/* KARAKTER */}
        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold mb-4">
            Karakter Sedang Dibaca
          </h2>

          <div className="text-6xl font-bold text-purple-600 tracking-widest">
            {currentText || "-"}
          </div>

        </div>

        {/* KATA TOXIC */}
        {detectedWord && (

          <div className="text-center mb-10">

            <h2 className="text-3xl font-bold mb-3">
              Kata Toxic Terdeteksi
            </h2>

            <div className="text-5xl font-bold text-red-600">
              {detectedWord}
            </div>

          </div>

        )}

        {/* BUTTON */}
        <div className="flex justify-center gap-4 mb-10">

          <button
            onClick={startSimulation}
            disabled={running}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xl font-semibold transition"
          >
            {running ? "Simulasi Berjalan..." : "Mulai Simulasi"}
          </button>

          <button
            onClick={resetSimulation}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xl font-semibold transition"
          >
            Reset
          </button>

        </div>

        {/* HASIL */}
        {result && (

          <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-6 text-center mb-12">

            <h2 className="text-3xl font-bold text-red-700">
              {result}
            </h2>

          </div>

        )}

        {/* HISTORY */}
        <div className="mb-12">

          <h2 className="text-3xl font-bold text-center mb-6">
            Riwayat Proses DFA
          </h2>

          <div className="bg-gray-100 rounded-2xl p-6">

            {history.length === 0 ? (

              <p className="text-lg text-gray-500">
                Belum ada proses
              </p>

            ) : (

              history.map((item, index) => (

                <div
                  key={index}
                  className="text-xl mb-3 border-b pb-2"
                >
                  {item}
                </div>

              ))

            )}

          </div>

        </div>

        {/* TRANSITION TABLE */}
        <div className="mb-12">

          <h2 className="text-3xl font-bold text-center mb-6">
            Transition Table DFA
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse border border-gray-400">

              <thead>

                <tr className="bg-gray-200">

                  <th className="border border-gray-400 p-4 text-xl">
                    Current State
                  </th>

                  <th className="border border-gray-400 p-4 text-xl">
                    Input
                  </th>

                  <th className="border border-gray-400 p-4 text-xl">
                    Next State
                  </th>

                </tr>

              </thead>

              <tbody>

                {detectedWord &&
                  detectedWord.split("").map((char, index) => (

                    <tr
                      key={index}
                      className="text-center"
                    >

                      <td className="border border-gray-400 p-4 text-lg">

                        {index === 0
                          ? "q0"
                          : `q${index}`}

                      </td>

                      <td className="border border-gray-400 p-4 text-lg">
                        {char}
                      </td>

                      <td className="border border-gray-400 p-4 text-lg">

                        {index === detectedWord.length - 1
                          ? "qf"
                          : `q${index + 1}`}

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* STATISTIK */}
        <div className="border-t pt-8">

          <h2 className="text-3xl font-bold text-center mb-6">
            Statistik DFA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-blue-100 rounded-2xl p-6 text-center">

              <h3 className="text-2xl font-bold mb-2">
                Jumlah State
              </h3>

              <p className="text-4xl font-bold">
                {states.length}
              </p>

            </div>

            <div className="bg-green-100 rounded-2xl p-6 text-center">

              <h3 className="text-2xl font-bold mb-2">
                Jumlah Transisi
              </h3>

              <p className="text-4xl font-bold">
                {states.length - 1}
              </p>

            </div>

            <div className="bg-red-100 rounded-2xl p-6 text-center">

              <h3 className="text-2xl font-bold mb-2">
                Final State
              </h3>

              <p className="text-4xl font-bold">
                qf
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}