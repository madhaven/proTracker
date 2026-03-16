using System.ComponentModel.DataAnnotations;

namespace ProTracker.Web.Contracts;

public record GoalUpdateRequest
{
    [Required]
    public required string Title { get; set; } = string.Empty;
    
    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateTarget { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}