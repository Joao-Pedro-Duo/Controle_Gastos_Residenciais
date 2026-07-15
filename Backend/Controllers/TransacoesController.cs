using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> ListarTransacoes()
    {
        var transacoes = await _context.Transacoes.ToListAsync();

        return Ok(transacoes);
    }

    [HttpPost]
    public async Task<IActionResult> CadastrarTransacao(CriarTransacaoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao))
        {
            return BadRequest("A descrição da transação é obrigatória.");
        }

        if (dto.Valor <= 0)
        {
            return BadRequest("O valor da transação deve ser maior que zero.");
        }

        if (!Enum.IsDefined(typeof(TipoTransacao), dto.Tipo))
        {
            return BadRequest(
            "O tipo da transação deve ser Receita ou Despesa.");
        }

        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);

        if (pessoa == null)
        {
            return BadRequest("A pessoa informada não existe.");
        }

        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
        {
            return BadRequest("Pessoas menores de 18 anos só podem cadastrar despesas.");
        }

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);

        await _context.SaveChangesAsync();

        return Created($"/api/transacoes/{transacao.Id}", transacao);
    }
}