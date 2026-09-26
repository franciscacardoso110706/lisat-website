import Image from 'next/image'
import { Container, Section } from '@/components/ui/Section'
import { mission } from '@/data/mission'

/**
 * CubeSat Portugal — the national programme LISAT-01 is competing in.
 *
 * The photograph is the section, and nothing is laid across it. An earlier
 * version put a navy band over the middle; it made the type easy and the
 * picture pointless, because the band covered the stage the picture was of.
 *
 * Instead the type sits to the right and only that side is darkened and
 * blurred — enough to read against, and fading out well before it reaches the
 * stage. The left two thirds of the room are untouched.
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
        Two layers, because they fade differently: the blur has to stop early
        or the whole frame goes soft, and the darkness has to reach further to
        carry the last line of type.
      */}
      <div className="cp-blur" aria-hidden="true" />
      <div className="cp-shade" aria-hidden="true" />

      <Container wide className="cp-inner">
        <div className="cp-text">
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
      </Container>
    </Section>
  )
}
