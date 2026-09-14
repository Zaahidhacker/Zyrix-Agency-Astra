import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/schema";
export function RelayPreview() {
  return (
    <div
      className="relay-preview"
      aria-label="Relay web application interface concept with illustrative project data"
    >
      <div className="relay-browser">
        <div className="relay-sidebar">
          <b>
            relay<span>®</span>
          </b>
          <span className="active">Overview</span>
          <span>Projects</span>
          <span>Activity</span>
          <span>Settings</span>
          <small>
            YOUR WORK,
            <br />
            CONNECTED.
          </small>
        </div>
        <div className="relay-main">
          <div className="relay-top">
            <span>Workspace / Overview</span>
            <span>AM</span>
          </div>
          <p>MONDAY, IN FOCUS</p>
          <h3>A little more clarity.</h3>
          <div className="relay-stats">
            <div>
              <span>Active projects</span>
              <b>
                12<small> +2 this week</small>
              </b>
            </div>
            <div>
              <span>Tasks completed</span>
              <b>
                84<small> Looking good</small>
              </b>
            </div>
          </div>
          <div className="relay-chart">
            <div>
              <span>Team momentum</span>
              <span>THIS WEEK</span>
            </div>
            <svg
              viewBox="0 0 480 130"
              role="img"
              aria-label="Illustrative rising activity chart"
            >
              <path
                d="M0 110H480M0 70H480M0 30H480"
                stroke="#dddddd"
                strokeWidth="1"
              />
              <path
                d="M0 105L45 95L85 104L120 76L165 84L210 47L255 64L305 30L355 44L400 18L445 30L480 10"
                stroke="#494ae9"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <div className="relay-task">
            <span>Website launch</span>
            <span>In progress</span>
          </div>
          <div className="relay-task">
            <span>Brand direction</span>
            <span>Ready for review</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className={`project-card project-${index} theme-${project.theme}`}
      data-reveal
    >
      <Link
        href={`/work/${project.slug}`}
        className="project-visual"
        aria-label={`Explore ${project.title}: ${project.category}`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes={
              index === 0
                ? "(max-width: 760px) 100vw, 92vw"
                : "(max-width: 760px) 100vw, 46vw"
            }
            data-parallax
          />
        ) : (
          <RelayPreview />
        )}
        <div className="project-overlay">
          <div className="project-visual-bottom">
            <span>{project.headline}</span>
            <span className="circle-link">
              <ArrowUpRight size={26} />
            </span>
          </div>
        </div>
      </Link>
      <div className="project-caption">
        <div>
          <h3>
            <Link href={`/work/${project.slug}`}>{project.title}</Link>
          </h3>
          <span className="project-type">{project.category}</span>
        </div>
        {project.concept && (
          <span className="concept-tag mono">STUDIO CONCEPT</span>
        )}
      </div>
    </article>
  );
}
