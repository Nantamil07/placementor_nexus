import { Education, Project, Skill } from "@prisma/client";

interface ProfileAboutProps {
  bio?: string | null;
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export function ProfileAbout({
  bio,
  education,
  skills,
  projects,
}: ProfileAboutProps) {
  const primaryEdu = education[0];

  return (
    <div className="space-y-6">
      {bio && (
        <section className="rounded-xl border bg-card p-6 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {bio}
          </p>
        </section>
      )}

      {primaryEdu && (
        <section className="rounded-xl border bg-card p-6 shadow-xs">
          <h2 className="text-base font-semibold text-foreground">Academic Background</h2>
          <div className="mt-3 space-y-1">
            <h3 className="text-sm font-bold text-foreground">{primaryEdu.institution}</h3>
            <p className="text-sm text-muted-foreground">
              {primaryEdu.fieldOfStudy ? `${primaryEdu.degree} in ${primaryEdu.fieldOfStudy}` : primaryEdu.degree}
            </p>
            {primaryEdu.grade && (
              <p className="text-xs font-medium text-primary">CGPA: {primaryEdu.grade}</p>
            )}
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-card p-6 shadow-xs">
        <h2 className="text-base font-semibold text-foreground">Skills & Endorsements</h2>
        {skills.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-md border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No skills listed yet.</p>
        )}
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-xs">
        <h2 className="text-base font-semibold text-foreground">Featured Projects</h2>
        {projects.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-lg border bg-background p-4"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3 pt-2 text-xs font-medium">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Repository ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No projects added yet.</p>
        )}
      </section>
    </div>
  );
}
