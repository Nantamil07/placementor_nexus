interface ProfileLinksProps {
  username: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  leetcodeUrl?: string | null;
}

export function ProfileLinks({
  username,
  githubUrl,
  linkedinUrl,
  leetcodeUrl,
}: ProfileLinksProps) {
  const defaultGithub = githubUrl || `https://github.com/${username}`;
  const defaultLinkedin = linkedinUrl || `https://linkedin.com/in/${username}`;
  const defaultLeetcode = leetcodeUrl || `https://leetcode.com/${username}`;

  const links = [
    { label: "GitHub", url: defaultGithub, icon: "💻" },
    { label: "LinkedIn", url: defaultLinkedin, icon: "💼" },
    { label: "LeetCode", url: defaultLeetcode, icon: "⚡" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Coding & Social Profiles
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
            <span className="text-muted-foreground">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
