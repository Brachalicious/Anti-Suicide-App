import { ExternalLink, Music, Brain, Baby, Building2, Users, BookOpen, Phone } from "lucide-react";

export default function Resources() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground text-lg">
          A curated collection of wellness tools, educational resources, and support programs.
        </p>
      </div>

      {/* ── Wellness Tools ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Music className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Wellness Tools</h2>
        </div>
        <div className="space-y-4">

          {/* Find a Therapist */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Find a Therapist or Counselor</h3>
            <p className="text-muted-foreground">
              Search for licensed therapists, counselors, and mental health professionals in your area.
            </p>
            <a
              href="https://www.psychologytoday.com/us/therapists"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium"
            >
              Search for a Therapist <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Healing Music */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Healing Music</h3>
            <p className="text-muted-foreground mb-4">
              Music can be a powerful tool for emotional healing and regulation. Put on headphones, close your eyes, and let the sound carry you.
            </p>

            {/* Binaural Beats */}
            <div className="mb-4 pl-4 border-l-2 border-primary/30">
              <h4 className="font-medium mb-1">Binaural Beats — Deep Calm</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Plays calming theta-wave binaural beats (best with headphones). Gently guides your brain toward a relaxed, meditative state.
              </p>
              <a
                href="https://www.youtube.com/results?search_query=binaural+beats+deep+calm+theta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Listen on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Nature Sounds */}
            <div className="mb-4 pl-4 border-l-2 border-primary/30">
              <h4 className="font-medium mb-1">Nature Sounds</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Gentle ambient sounds to help ground you in the present moment.
              </p>
              <a
                href="https://www.youtube.com/results?search_query=nature+sounds+relaxing+ambient"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Listen on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Playlists */}
            <div className="pl-4 border-l-2 border-primary/30">
              <h4 className="font-medium mb-1">Healing Music Playlists</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Curated playlists for emotional support and calm.
              </p>
              <a
                href="https://open.spotify.com/search/healing%20mental%20health"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Browse on Spotify <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Crisis Alternatives */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Crisis Alternatives</h3>
            <p className="text-muted-foreground mb-4">
              Sometimes calling the police during a mental health crisis can escalate the situation. These resources provide alternative crisis response options.
            </p>

            <div className="mb-4 pl-4 border-l-2 border-orange-400/50">
              <h4 className="font-medium mb-1">Don't Call the Police — NYC Crisis Alternatives</h4>
              <p className="text-sm text-muted-foreground mb-2">
                A comprehensive guide to mental health crisis resources in New York City that don't involve police. Includes mobile crisis teams, peer-run warmlines, crisis respite centers, and community-based alternatives for people experiencing psychiatric emergencies.
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                🚨 These alternatives can provide compassionate, trauma-informed crisis support without the risk of criminalization or forced hospitalization.
              </p>
              <a
                href="https://dontcallthepolice.com/nyc/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                View NYC Alternatives <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="pl-4 border-l-2 border-purple-400/50">
              <h4 className="font-medium mb-1">Take Back the Night</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Take Back the Night is an international organization dedicated to ending sexual assault, domestic violence, dating violence, sexual abuse, and all forms of gender-based violence. They provide education, advocacy, and support resources for survivors and communities.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                💜 Whether you're a survivor, supporter, or advocate, TBTN offers resources, community events, and tools to create safer spaces and break the silence around sexual violence.
              </p>
              <a
                href="https://takebackthenight.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Visit Take Back the Night <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Educational Resources ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Educational Resources</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-card p-5 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Understanding Depression</h3>
            <p className="text-sm text-muted-foreground">
              Depression is more than just feeling sad. It's a real medical condition that affects how you think, feel, and handle daily activities. It is treatable, and most people who receive treatment get better.
            </p>
            <a
              href="https://www.nimh.nih.gov/health/topics/depression"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-5 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Anxiety &amp; Stress Management</h3>
            <p className="text-sm text-muted-foreground">
              Anxiety is a normal reaction to stress, but when it becomes excessive, it may be a disorder. Learning to manage stress through healthy coping mechanisms can make a significant difference.
            </p>
            <a
              href="https://www.nimh.nih.gov/health/topics/anxiety-disorders"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-5 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Building Resilience</h3>
            <p className="text-sm text-muted-foreground">
              Resilience is the ability to bounce back from setbacks. It can be developed through strong relationships, self-care, finding purpose, embracing healthy thoughts, and seeking help when needed.
            </p>
            <a
              href="https://www.apa.org/topics/resilience"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-5 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Self-Care Practices</h3>
            <p className="text-sm text-muted-foreground">
              Regular exercise, adequate sleep, healthy eating, staying connected with loved ones, and setting healthy boundaries are all essential parts of maintaining good mental health.
            </p>
            <a
              href="https://www.mentalhealth.gov/basics/what-is-mental-health"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Hospitals & IOPs ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Hospitals &amp; IOPs</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          If you need a higher level of care, these options provide structured treatment programs and 24/7 support. Intensive Outpatient Programs (IOPs) offer flexible, focused therapy while you continue daily life.
        </p>

        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Finding a Psychiatric Hospital</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Psychiatric hospitals provide 24/7 inpatient care for individuals experiencing severe mental health crises. If you or someone you know is in immediate danger, call 988 or Hatzoloh (718-230-1000).
            </p>
            <a
              href="https://findtreatment.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Find Treatment Near You <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Intensive Outpatient Programs (IOPs)</h3>
            <p className="text-sm text-muted-foreground">
              IOPs provide structured therapy sessions (typically 3–5 days per week, 3+ hours per day) while allowing you to live at home. They're ideal for people who need more support than weekly therapy but don't require 24/7 inpatient care.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Partial Hospitalization Programs (PHPs)</h3>
            <p className="text-sm text-muted-foreground">
              PHPs offer full-day treatment programs (5–7 days per week) that provide intensive therapy, medication management, and skills training. You return home each evening, bridging the gap between inpatient care and IOPs.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Crisis Stabilization Units</h3>
            <p className="text-sm text-muted-foreground">
              Short-term residential programs (typically 24–72 hours) designed to stabilize individuals in acute mental health crisis. They offer a safe environment with clinical support as an alternative to emergency rooms.
            </p>
          </div>

          {/* Level of Care Guide */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
            <h3 className="font-semibold mb-3">How to Choose the Right Level of Care</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Inpatient/Hospital:</span> For immediate safety concerns, severe symptoms, or when you can't care for yourself.</li>
              <li><span className="font-medium text-foreground">PHP:</span> For significant symptoms that need daily professional support but you're safe at home.</li>
              <li><span className="font-medium text-foreground">IOP:</span> For moderate symptoms, stepping down from higher care, or when you need more than weekly therapy.</li>
              <li><span className="font-medium text-foreground">Outpatient:</span> For ongoing maintenance, mild-to-moderate symptoms, and regular check-ins.</li>
            </ul>
          </div>
        </div>

        {/* Personally Recommended Programs */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Personally Recommended Programs</h3>
          <p className="text-muted-foreground mb-4">Programs we personally recommend for mental health support and treatment.</p>
          <div className="space-y-4">

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold mb-2">Charlie Health</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Charlie Health offers personalized virtual Intensive Outpatient Programs (IOP) for teens, young adults, and families dealing with anxiety, depression, trauma, and other mental health challenges. Their approach combines individual therapy, group sessions, and family therapy — all from the comfort of home.
              </p>
              <a
                href="https://www.charliehealth.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Visit Charlie Health <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="flex items-start gap-2 mb-2">
                <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <h4 className="font-semibold">Young Adult Crisis Support — Nevonim</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                A family of 1:1 guides and care managers serving young adults in crisis on their journey toward recovery, healing, and self-actualization. Leveraging wisdom from their own life experiences of trauma, rehab, and recovery, Nevonim becomes a trusted confidante and loyal guide — family, not bureaucrats; friends, not professionals.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Services:</span> Intake &amp; evaluations, therapy/psychiatry referrals, care management, rehab &amp; trauma center placement, life coaching, couple's consulting, yeshiva placements
              </p>
              <p className="text-sm italic text-muted-foreground mb-3">
                "Just because no one else can heal or do your inner work for you, doesn't mean you can, should, or need to do it alone."
              </p>
              <a
                href="https://www.nevonim.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Visit Nevonim <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Frum IOP Programs */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Frum IOP Programs</h3>
          <p className="text-muted-foreground mb-4">Intensive Outpatient Programs serving the frum Jewish community.</p>
          <div className="space-y-4">

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold mb-2">Bikur Cholim Partners In Health</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Founded in 1981, Bikur Cholim has evolved into a multi-faceted organization uniquely positioned to meet the health needs of the Rockland community and beyond. Under Rabbi Simon Lauber's leadership, they provide innovative health-related services throughout the greater NYC area. With over 200 therapists on staff, their comprehensive programs include health information, behavioral health services, Project H.E.A.R.T., and Project H.O.P.E.
              </p>
              <div className="text-sm text-muted-foreground space-y-1 mb-3">
                <p>📍 25 Robert Pitt Drive Suite 101, Monsey, NY 10952</p>
                <p>📞 <a href="tel:8454257877" className="text-primary hover:underline">(845) 425-7877</a> &nbsp;|&nbsp; ✉️ <a href="mailto:bcinfo@bikurcholim.org" className="text-primary hover:underline">bcinfo@bikurcholim.org</a></p>
              </div>
              <a
                href="https://www.bikurcholim.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Visit Bikur Cholim <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold mb-2">Tikvah Healing Center</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A community-rooted nonprofit offering IOP, PHP, and outpatient counseling with a unique "Tribe" approach. Many clinicians have lived experience with recovery. Small, personal groups, family healing, and spiritual wisdom are woven into treatment.
              </p>
              <div className="text-sm text-muted-foreground space-y-1 mb-3">
                <p>📍 3320 Dundee Road, Northbrook, IL 60062</p>
                <p>📞 <a href="tel:8472267741" className="text-primary hover:underline">(847) 226-7741</a> &nbsp;|&nbsp; ✉️ <a href="mailto:intake@tikvahhealing.org" className="text-primary hover:underline">intake@tikvahhealing.org</a></p>
              </div>
              <a
                href="https://www.tikvahhealing.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Visit Tikvah Healing Center <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold mb-2">Achieve Behavioral Health — IOP</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A one-of-a-kind Intensive Outpatient Program for women in the Jewish community. Whether post-hospitalization, to prevent hospitalization, or when standard therapy is not enough — Achieve's IOP includes individual and group therapy, family therapy, skills coaching, and support services.
              </p>
              <p className="text-sm text-muted-foreground">
                After one year, participants have shown significant reduction in hospitalizations, improvement in overall function, and increase in employment rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Postpartum & Maternal Mental Health ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Baby className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">🤱 Postpartum &amp; Maternal Mental Health</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          Pregnancy and postpartum can be overwhelming. These resources provide specialized support for maternal mental health, postpartum depression, anxiety, and perinatal mood disorders.
        </p>
        <div className="space-y-4">

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">National Maternal Mental Health Hotline</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Free, confidential support 24/7 for pregnant and new parents. Call or text to speak with a trained counselor who understands maternal mental health.
            </p>
            <a
              href="tel:18338526262"
              className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-200 dark:hover:bg-pink-950/50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              📞 1-833-TLC-MAMA (1-833-852-6262)
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Postpartum Support International (PSI)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              PSI is the world's leading organization dedicated to helping families suffering from perinatal mood and anxiety disorders. They offer online support meetings, resources, and provider directories.
            </p>
            <a
              href="https://www.postpartum.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit PSI <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Postpartum Resource Center of New York</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Comprehensive support for pregnant and postpartum individuals in New York, including support groups, therapy referrals, and educational resources for perinatal mood and anxiety disorders.
            </p>
            <a
              href="https://postpartumny.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit Postpartum Resource Center NY <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">JFCS Boston — Center for Early Relationship Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Specialized services for pregnant and postpartum women experiencing depression, anxiety, OCD, and trauma. Offers therapy, support groups, and parent-infant services.
            </p>
            <a
              href="https://www.jfcsboston.org/Our-Services/Early-Relationship-Support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit JFCS Boston <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Ohel — Postpartum Depression Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Mental health services for the Jewish community, including specialized support for postpartum depression, maternal anxiety, and perinatal mood disorders.
            </p>
            <a
              href="https://www.ohel.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit Ohel <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Rachel's Place</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Dedicated to supporting women and families experiencing pregnancy and infant loss, offering compassionate care, resources, and community support.
            </p>
          </div>
        </div>
      </section>

      {/* ── Additional Mental Health Resources ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">🧠 Additional Mental Health Resources</h2>
        </div>
        <div className="space-y-4">

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">The Jewish Board</h3>
            <p className="text-sm text-muted-foreground mb-3">
              One of NYC's largest social service agencies, providing mental health, developmental disability, educational, and community support services. Comprehensive resources for children, teens, adults, and families.
            </p>
            <a
              href="https://www.jewishboard.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit The Jewish Board <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">DBT Treatment in Israel (NEABPD)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The National Education Alliance for Borderline Personality Disorder Israel provides information about Dialectical Behavior Therapy (DBT) treatment options available in Israel.
            </p>
            <a
              href="https://www.neabpd.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit NEABPD <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Relief Resources</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Mental health and crisis support resources for individuals and families seeking help and healing.
            </p>
            <a
              href="https://www.relief-inc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              Visit Relief Resources <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-8 text-center p-6 bg-card rounded-lg border">
        <p className="text-sm text-muted-foreground">
          MysticMinded³³ is a spiritually-based brand rooted in Kabbalistic teachings, focusing on the soul aspect of healing—mind, body, and soul.{" "}
          If you're in crisis, please call{" "}
          <a href="tel:988" className="text-primary hover:underline font-medium">988</a>{" "}
          or Hatzoloh{" "}
          <a href="tel:7182301000" className="text-primary hover:underline font-medium">(718-230-1000)</a>{" "}
          immediately.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © 2026 MysticMinded³³. Not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
