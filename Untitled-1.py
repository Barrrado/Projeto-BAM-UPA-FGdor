from ensurepip import version

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os

app = FastAPI()

# ==============================
# MODELO DE DADOS
# ==============================
class Boletim(BaseModel):
    paciente_nome: str
    paciente_idade: int
    paciente_sexo: str
    paciente_cpf: Optional[str] = ""
    paciente_rg: Optional[str] = ""
    endereco: Optional[str] = ""
    telefone: Optional[str] = ""
    
    data_chegada: str
    hora_chegada: str
    setor: str
    convenio: str
    tipo_ocorrencia: str
    causa_lesao: Optional[str] = ""
    
    observacao_entrada: Optional[str] = ""
    anamnese: Optional[str] = ""
    sinais_vitais: Optional[str] = ""
    
    prescricao_medica: Optional[str] = ""
    evolucao_paciente: Optional[str] = ""
    encaminhamento: Optional[str] = ""
    
    medico_responsavel: str
    enfermeiro_responsavel: Optional[str] = ""


# ==============================
# GERAÇÃO DO PDF
# ==============================
def gerar_pdf(boletim: Boletim, filename="boletim.pdf"):
    c = canvas.Canvas(filename, pagesize=A4)
    largura, altura = A4

    # Cabeçalho
    c.setFont("Helvetica-Bold", 14)
    c.drawString(200, altura - 50, "BOLETIM DE ATENDIMENTO MÉDICO - SUS")

    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 90, f"Paciente: {boletim.paciente_nome}   Idade: {boletim.paciente_idade}   Sexo: {boletim.paciente_sexo}")
    c.drawString(50, altura - 110, f"CPF: {boletim.paciente_cpf}   RG: {boletim.paciente_rg}")
    c.drawString(50, altura - 130, f"Endereço: {boletim.endereco}")
    c.drawString(50, altura - 150, f"Telefone: {boletim.telefone}")

    # Atendimento
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, altura - 180, "Dados de Atendimento")
    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 200, f"Data/Hora Chegada: {boletim.data_chegada} {boletim.hora_chegada}")
    c.drawString(50, altura - 220, f"Setor: {boletim.setor}   Convênio: {boletim.convenio}")
    c.drawString(50, altura - 240, f"Tipo Ocorrência: {boletim.tipo_ocorrencia}   Causa Lesão: {boletim.causa_lesao}")

    # Avaliação
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, altura - 270, "Avaliação Inicial")
    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 290, f"Observação de Entrada: {boletim.observacao_entrada}")
    c.drawString(50, altura - 310, f"Anamnese: {boletim.anamnese}")
    c.drawString(50, altura - 330, f"Sinais Vitais: {boletim.sinais_vitais}")

    # Evolução
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, altura - 360, "Evolução")
    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 380, f"Prescrição Médica: {boletim.prescricao_medica}")
    c.drawString(50, altura - 400, f"Evolução: {boletim.evolucao_paciente}")
    c.drawString(50, altura - 420, f"Encaminhamento: {boletim.encaminhamento}")

    # Assinaturas
    c.setFont("Helvetica", 10)
    c.drawString(50, altura - 470, f"Médico Responsável: {boletim.medico_responsavel}")
    c.drawString(50, altura - 490, f"Enfermeiro Responsável: {boletim.enfermeiro_responsavel}")

    c.showPage()
    c.save()
    return filename


# ==============================
# ENDPOINTS
# ==============================
@app.post("/gerar_boletim")
def criar_boletim(boletim: Boletim):
    filename = "boletim.pdf"
    gerar_pdf(boletim, filename)
    return {"msg": "Boletim gerado com sucesso!", "arquivo": filename}

@app.get("/baixar_boletim")
def baixar_boletim():
    filepath = "boletim.pdf"
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="application/pdf", filename="boletim.pdf")
    else:
        return {"erro": "Nenhum boletim gerado ainda."}