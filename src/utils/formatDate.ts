export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const minutes = Math.round(diffInMinutes);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const hours = Math.round(diffInHours);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  if (diffInDays < 7) {
    const days = Math.round(diffInDays);
    return `${days} days ago`;
  }
  
  // 1 week specifically
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) {
    return 'last week';
  }
  
  // 2-3 weeks
  if (diffInWeeks <= 3) {
    return `${diffInWeeks} weeks ago`;
  }
  
  // Less than ~2 months (show "last month")
  if (diffInDays < 60) {
    return 'last month';
  }
  
  // Older than 2 months - show the actual date
  return `on ${past.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
}