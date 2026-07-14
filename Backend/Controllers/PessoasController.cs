using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

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
    public IActionResult ListarPessoas()
    {
        var pessoas = _context.Pessoas.ToList();

        return Ok(pessoas);
    }

    [HttpPost]
    public IActionResult CadastrarPessoa(Pessoa pessoa)
    {
        if (string.IsNullOrWhiteSpace(pessoa.Nome))
        {
        return BadRequest("O nome da pessoa é obrigatório.");
        }

        if (pessoa.Idade < 0)
        {
        return BadRequest("A idade não pode ser negativa.");
        }

        _context.Pessoas.Add(pessoa);

        _context.SaveChanges();

        return Created($"/api/pessoas/{pessoa.Id}", pessoa);
    }

    [HttpDelete("{id}")]
    public IActionResult DeletarPessoa(int id)
    {
        var pessoa = _context.Pessoas.Find(id);

        if (pessoa == null)
        {
            return NotFound("Pessoa não encontrada.");
        }

        _context.Pessoas.Remove(pessoa);

        _context.SaveChanges();

        return NoContent();
    }
}