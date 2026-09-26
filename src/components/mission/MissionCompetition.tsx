import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { mission } from '@/data/mission'

/**
 * CubeSat Portugal — the national programme LISAT-01 is competing in.
 *
 * One photograph and one band. The previous version split the same few facts
 * across two columns, a table and a second picture, which made a paragraph of
 * context look like a chapter of the mission.
 *
 * The band is translucent rather than solid so the stage stays legible behind
 * it: the point of the photograph is that this is a real programme with a real
 * room, and covering it with navy would leave only the texture of one.
 */
export function MissionCompetition() {
  const { competition } = mission

  return (
    <Section tone="void" join="curve" spacing="none" className="cp">
      <Image
        src="/images/mission/cubesat-portugal-stage.jpg"
        alt="The CubeSat Portugal stage at the Portuguese Space Agency, before the programme's opening session"
        fill
        loading="lazy"
        sizes="100vw"
        className="cp-photo object-cover"
      />

      {/*
        Held away from the top and bottom edges so the band reads as something
        lying on the photograph rather than a letterbox cut out of it.
      */}
      <div className="cp-band">
        <div className="cp-inner">
          <p className="cp-pill">{competition.name}</p>

          <p className="cp-copy">{competition.description}</p>

          <dl className="cp-facts">
            <div>
              <dt className="eyebrow text-brand-soft">Organiser</dt>
              <dd className="cp-fact">{competition.organiser}</dd>
            </div>
            <div>
              <dt className="eyebrow text-brand-soft">Teams competing</dt>
              <dd className="cp-fact tabular">{competition.teams}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  )
}
