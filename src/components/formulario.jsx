import React, { useState } from "react";

// Certifique-se de que a sua API do FastAPI está rodando em http://localhost:8000 fiz isso utilizando unvicorn instalar pip install fastapi 'uvicorn[standard]'
// A URL deve corresponder exatamente ao endereço que o seu servidor Python está usando.
const API_URL = "http://localhost:8000";

function Boletim() {
  // # Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    paciente_nome: "",
    paciente_idade: "",
    paciente_sexo: "",
    paciente_cpf: "",
    paciente_rg: "",
    endereco: "",
    telefone: "",
    data_chegada: "",
    hora_chegada: "",
    setor: "",
    convenio: "",
    tipo_ocorrencia: "",
    causa_lesao: "",
    observacao_entrada: "",
    anamnese: "",
    sinais_vitais: "",
    prescricao_medica: "",
    evolucao_paciente: "",
    encaminhamento: "",
    medico_responsavel: "",
    enfermeiro_responsavel: "",
  });

  // # Estado para controlar o carregamento e o status das operações
  const [isLoading, setIsLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // # Lida com a mudança de valor em qualquer campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // # Lida com o envio do formulário para gerar o PDF
  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPdfReady(false);
    setStatusMessage("Gerando boletim em PDF...");

    try {
      console.log(
        `Tentando conectar com o backend em: ${API_URL}/gerar_boletim`
      );
      const response = await fetch(`${API_URL}/gerar_boletim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          paciente_idade: Number(formData.paciente_idade),
        }),
      });

      if (response.ok) {
        setStatusMessage(
          "Boletim gerado com sucesso! Você já pode baixar o arquivo."
        );
        setPdfReady(true);
      } else {
        const errorData = await response.json();
        setStatusMessage(
          `Erro ao gerar boletim: ${errorData.erro || "Resposta inválida do servidor"}`
        );
      }
    } catch (error) {
      setStatusMessage(
        `Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o endereço está correto em ${API_URL}`
      );
      console.error("Erro de conexão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // # Lida com o clique para baixar o PDF
  const handleDownloadPDF = async () => {
    setStatusMessage("Baixando boletim...");
    try {
      console.log(`Tentando baixar o PDF de: ${API_URL}/baixar_boletim`);
      const response = await fetch(`${API_URL}/baixar_boletim`, {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "boletim.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setStatusMessage("Download concluído.");
      } else {
        const errorData = await response.json();
        setStatusMessage(
          `Erro ao baixar o arquivo: ${errorData.erro || "Arquivo não encontrado."}`
        );
      }
    } catch (error) {
      setStatusMessage(`Erro de conexão: ${error.message}`);
      console.error("Erro de conexão:", error);
    }
  };

  // # Seções de campos do formulário para melhor organização
  const sections = [
    {
      title: "Informações do Paciente",
      fields: [
        { name: "paciente_nome", label: "Nome", type: "text", required: true },
        {
          name: "paciente_idade",
          label: "Idade",
          type: "number",
          required: true,
        },
        { name: "paciente_sexo", label: "Sexo", type: "text", required: true },
        { name: "paciente_cpf", label: "CPF", type: "text" },
        { name: "paciente_rg", label: "RG", type: "text" },
        { name: "endereco", label: "Endereço", type: "text" },
        { name: "telefone", label: "Telefone", type: "tel" },
      ],
    },
    {
      title: "Detalhes do Atendimento",
      fields: [
        {
          name: "data_chegada",
          label: "Data de Chegada",
          type: "date",
          required: true,
        },
        {
          name: "hora_chegada",
          label: "Hora de Chegada",
          type: "time",
          required: true,
        },
        { name: "setor", label: "Setor", type: "text", required: true },
        { name: "convenio", label: "Convênio", type: "text", required: true },
        {
          name: "tipo_ocorrencia",
          label: "Tipo de Ocorrência",
          type: "text",
          required: true,
        },
        { name: "causa_lesao", label: "Causa da Lesão", type: "text" },
      ],
    },
    {
      title: "Observações Clínicas",
      fields: [
        {
          name: "observacao_entrada",
          label: "Observação de Entrada",
          type: "textarea",
        },
        { name: "anamnese", label: "Anamnese", type: "textarea" },
        { name: "sinais_vitais", label: "Sinais Vitais", type: "textarea" },
      ],
    },
    {
      title: "Procedimentos e Encaminhamento",
      fields: [
        {
          name: "prescricao_medica",
          label: "Prescrição Médica",
          type: "textarea",
        },
        {
          name: "evolucao_paciente",
          label: "Evolução do Paciente",
          type: "textarea",
        },
        { name: "encaminhamento", label: "Encaminhamento", type: "textarea" },
      ],
    },
    {
      title: "Profissionais Responsáveis",
      fields: [
        {
          name: "medico_responsavel",
          label: "Médico Responsável",
          type: "text",
          required: true,
        },
        {
          name: "enfermeiro_responsavel",
          label: "Enfermeiro Responsável",
          type: "text",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Boletim de Ocorrência
          </h1>
          <p className="text-gray-600">
            Preencha os dados abaixo para gerar e baixar o boletim em PDF.
          </p>
        </header>

        <form onSubmit={handleGeneratePDF} className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.fields.map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        rows="3"
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Gerando..." : "Gerar Boletim PDF"}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                !pdfReady
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg"
              }`}
              disabled={!pdfReady}
            >
              Baixar PDF
            </button>
          </div>

          {statusMessage && (
            <p className="mt-4 text-center text-gray-700 font-semibold">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Boletim;
