import Image from "next/image";
import Link from "next/link";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type NotFoundPageProps = {
  homeHref?: string;
};

function NotFoundHero() {
  return (
    <div className="relative w-full overflow-visible">
      <div className="relative z-10 mx-auto w-full max-w-[420px]">
        <Image
          src="/404.png"
          alt=""
          width={420}
          height={200}
          priority
          className="w-full h-auto object-contain"
          aria-hidden
        />
      </div>
      <div className="relative -mt-5 sm:-mt-6 w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] -ml-6 sm:-ml-10">
        <Image
          src="/switch.png"
          alt=""
          width={640}
          height={48}
          priority
          className="w-full h-[34px] sm:h-[42px] object-fill"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function NotFoundPage({ homeHref = "/" }: NotFoundPageProps) {
  return (
    <div
      className="min-h-screen bg-[#111023] flex flex-col"
      style={inter}
    >
      <div className="px-6 sm:px-10 pt-8">
        <ThayloBrandLink />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pb-12">
        <div className="w-full max-w-[520px] text-center">
          <NotFoundHero />

          <h1
            className="text-white text-[22px] sm:text-[24px] font-semibold mt-10 mb-4"
            style={inter}
          >
            Page Not Found
          </h1>
          <p
            className="text-white/60 text-sm sm:text-[15px] leading-[1.7] max-w-[400px] mx-auto mb-10"
            style={inter}
          >
            Sorry, the page you&apos;re looking for does not exist or has been moved
            <br />
            please go back to the Home page
          </p>

          <Link
            href={homeHref}
            className="inline-flex w-full max-w-[420px] items-center justify-center rounded-full py-4 bg-[#00CED1] text-white text-sm font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity"
            style={inter}
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
