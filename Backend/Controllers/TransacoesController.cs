using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult ListarTransacoes()
    {
        var transacoes = _context.Transacoes.ToList();

        return Ok(transacoes);
    }

    [HttpPost]
    public IActionResult CadastrarTransacao(Transacao transacao)
    {
        if (string.IsNullOrWhiteSpace(transacao.Descricao))
        {
            return BadRequest("A descrição da transação é obrigatória.");
        }

        if (transacao.Valor <= 0)
        {
            return BadRequest("O valor da transação deve ser maior que zero.");
        }

        var pessoa = _context.Pessoas.Find(transacao.PessoaId);

        if (pessoa == null)
        {
            return BadRequest("A pessoa informada não existe.");
        }

        if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
        {
            return BadRequest("Pessoas menores de 18 anos só podem cadastrar despesas.");
        }

        _context.Transacoes.Add(transacao);

        _context.SaveChanges();

        return Created($"/api/transacoes/{transacao.Id}", transacao);
    }
}