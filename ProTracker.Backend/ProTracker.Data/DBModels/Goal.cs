using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("Goals")]
public class Goal
{
    [Key] public int Id { get; set; }
    public string Title { get; set; }

    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateTarget { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}