namespace Backend.DTOs;

public class ConsultaTotaisDto
{
    public List<PessoaTotalDto> Pessoas { get; set; } = new();

    public ResumoFinanceiroDto TotalGeral { get; set; } = new();
}