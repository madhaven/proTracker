using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("Goals")]
public class Goal
{
    [Key] public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }

    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateTarget { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}