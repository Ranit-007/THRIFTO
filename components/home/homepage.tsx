import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { bestSellers, collections, latestProducts, promotionImage, socialPosts, storyImage } from "@/lib/catalog";
import { store } from "@/config/store";
import { HeroSlider } from "@/components/HeroSlider";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Newsletter } from "@/components/site/newsletter";

export function Homepage() {
  return (
    <main id="top">
      <HeroSlider />
      <LatestDrop />
      <Collections />
      <BrandStory />
      <BestSellers />
      <Promotion />
      <Social />
      <Newsletter />
    </main>
  );
}

function LatestDrop() {
  return (
    <section className="section section--warm" id="latest-drop" aria-labelledby="latest-title">
      <div className="page-shell">
        <SectionHeading
          eyebrow="▶ THE LATEST DROP"
          title="New arrivals."
          headingId="latest-title"
          description="A first collection of premium cotton tees, graphic studies and everyday essentials."
          action={{ label: "View all pieces", href: "#best-sellers" }}
        />
        <div className="product-grid product-grid--four">
          {latestProducts.map((product, index) => <Reveal key={product.id} delay={index * 0.06}><ProductCard product={product} priority={index < 2} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section className="section section--warm collections" id="collections" aria-labelledby="collection-title">
      <div className="page-shell">
        <SectionHeading
          eyebrow="▶ BROWSE THE MOOD"
          title="Shop the collection."
          headingId="collection-title"
          description="Clean essentials and considered graphics, cut for every day."
        />
        <div className="collection-grid">
          {collections.map((collection) => (
            <a className={`collection-card collection-card--${collection.span ?? "standard"}`} href={collection.href} key={collection.name}>
              <Image src={collection.image} alt={collection.name} fill sizes="(max-width: 720px) 100vw, 50vw" />
              <span className="collection-card__shade" aria-hidden="true" />
              <div className="collection-card__copy">
                <p>{collection.description}</p>
                <h3>{collection.name}</h3>
                <span>Explore <ArrowUpRight aria-hidden="true" size={16} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="story" id="story" aria-labelledby="story-title">
      <div className="story__image">
        <Image src={storyImage} alt="Baundule editorial campaign in the city" fill sizes="(max-width: 900px) 100vw, 52vw" />
      </div>
      <div className="story__content">
        <p className="eyebrow">▶ OUR POINT OF VIEW</p>
        <h2 id="story-title">Built for<br />the different.</h2>
        <p>VÃ©loce is made for self-expression. Premium materials, honest details and silhouettes that hold their own.</p>
        <ArrowLink href="#newsletter">Our story</ArrowLink>
        <div className="story__note"><span>01</span><p>Small-batch studies in fabric, silhouette and time.</p></div>
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="section section--warm best-sellers" id="best-sellers" aria-labelledby="best-sellers-title">
      <div className="page-shell">
        <SectionHeading
          eyebrow="▶ WORN ON REPEAT"
          title="Best sellers."
          headingId="best-sellers-title"
          action={{ label: "See the full edit", href: "#latest-drop" }}
        />
        <div className="product-grid product-grid--three">
          {bestSellers.map((product, index) => <Reveal key={product.id} delay={index * 0.06}><ProductCard product={product} showRating /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Promotion() {
  return (
    <section className="promotion" aria-labelledby="promotion-title">
      <Image src={promotionImage} alt="Night streetwear editorial for limited capsule" fill sizes="100vw" />
      <div className="promotion__shade" aria-hidden="true" />
      <div className="promotion__content page-shell">
        <p className="eyebrow">{store.promotion.eyebrow}</p>
        <h2 id="promotion-title">{store.promotion.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <p>{store.promotion.body}</p>
        <a className="button button--light" href={store.promotion.href}>{store.promotion.cta} <ArrowUpRight aria-hidden="true" size={16} /></a>
      </div>
    </section>
  );
}

function Social() {
  return (
    <section className="social section--warm" id="social" aria-labelledby="social-title">
      <div className="page-shell social__heading">
        <div>
          <p className="eyebrow">▶ FROM THE WORLD</p>
          <h2 id="social-title">Baundule in motion.</h2>
        </div>
        <ArrowLink href="/contact">Contact the studio</ArrowLink>
      </div>
      <div className="social__grid">
        {socialPosts.map((post) => (
          <figure key={post.alt} className="social__post">
            <Image src={post.image} alt={post.alt} fill sizes="(max-width: 700px) 50vw, 20vw" />
            <span aria-hidden="true">BAUNDULE / CAMPAIGN</span>
          </figure>
        ))}
      </div>
    </section>
  );
}

