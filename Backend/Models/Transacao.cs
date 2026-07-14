using System.Text.Json.Serialization;

namespace Backend.Models;

public class Transacao
{
    public int Id { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public int PessoaId { get; set; }

    [JsonIgnore]
    public Pessoa? Pessoa { get; set; }
}