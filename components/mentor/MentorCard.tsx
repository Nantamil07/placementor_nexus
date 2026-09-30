import Link from "next/link";

export function MentorCard({ mentor }: { mentor: any }) {
  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {mentor.avatarUrl ? (
          <img src={mentor.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {mentor.fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-semibold">{mentor.fullName}</h2>
          <p className="text-sm text-muted-foreground">@{mentor.username}</p>
          {mentor.headline && <p className="mt-1 text-sm">{mentor.headline}</p>}
        </div>
      </div>
      {mentor.bio && <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{mentor.bio}</p>}
      {mentor.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {mentor.skills.slice(0, 6).map((skill: any) => (
            <span key={skill.id} className="rounded-full bg-muted px-2.5 py-1 text-xs">{skill.name}</span>
          ))}
        </div>
      )}
      <Link href={`/mentorship?mentor=${mentor.id}`} className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Request mentorship
      </Link>
    </article>
  );
}
