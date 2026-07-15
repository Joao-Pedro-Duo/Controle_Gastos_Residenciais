using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
     private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> ListarPessoas()
    {
        var pessoas = await _context.Pessoas.ToListAsync();

        return Ok(pessoas);
    }

    [HttpPost]
    public async Task<IActionResult> CadastrarPessoa(CriarPessoaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
        {
        return BadRequest("O nome da pessoa é obrigatório.");
        }

        if (dto.Idade < 0)
        {
        return BadRequest("A idade não pode ser negativa.");
        }

        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);

        await _context.SaveChangesAsync();

        return Created($"/api/pessoas/{pessoa.Id}", pessoa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarPessoa(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
        {
            return NotFound("Pessoa não encontrada.");
        }

        _context.Pessoas.Remove(pessoa);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}