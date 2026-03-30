using Microsoft.AspNetCore.Mvc;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Pinging the api with a string should return the same string back proving online status.
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    [HttpGet("online/{key}")]
    public IActionResult OnlineCheck(string key) => Ok(key);
}