using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult ConsultarTotais()
    {
        var pessoas = _context.Pessoas
            .Include(p => p.Transacoes)
            .ToList();

        var totaisPorPessoa = pessoas.Select(pessoa =>
        {
            var totalReceitas = pessoa.Transacoes
                .Where(transacao =>
                    transacao.Tipo == TipoTransacao.Receita)
                .Sum(transacao => transacao.Valor);

            var totalDespesas = pessoa.Transacoes
                .Where(transacao =>
                    transacao.Tipo == TipoTransacao.Despesa)
                .Sum(transacao => transacao.Valor);

            return new PessoaTotalDto
            {
                PessoaId = pessoa.Id,
                Nome = pessoa.Nome,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            };
        }).ToList();

        var totalGeralReceitas = totaisPorPessoa
            .Sum(pessoa => pessoa.TotalReceitas);

        var totalGeralDespesas = totaisPorPessoa
            .Sum(pessoa => pessoa.TotalDespesas);

        var resposta = new ConsultaTotaisDto
        {
            Pessoas = totaisPorPessoa,

            TotalGeral = new ResumoFinanceiroDto
            {
                TotalReceitas = totalGeralReceitas,
                TotalDespesas = totalGeralDespesas,
                Saldo = totalGeralReceitas - totalGeralDespesas
            }
        };

        return Ok(resposta);
    }   

}