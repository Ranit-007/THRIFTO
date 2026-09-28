"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { brand } from "@/config/brand";
import { heroSlides } from "@/lib/catalog";

export function HeroSlider() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const activeSlide = heroSlides[activeIndex];

	useEffect(() => {
		if (isPaused || heroSlides.length < 2) return;

		const intervalId = window.setInterval(() => {
			setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
		}, 5500);

		return () => window.clearInterval(intervalId);
	}, [isPaused]);

	return (
		<section
			className="hero"
			aria-labelledby="hero-title"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{heroSlides.map((slide, index) => (
				<Image
					key={slide.image}
					src={slide.image}
					alt={slide.title}
					fill
					priority={index === 0}
					sizes="100vw"
					aria-hidden={index !== activeIndex}
					className={`hero__image transition-opacity duration-1000 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
				/>
			))}
			<div className="hero__veil" aria-hidden="true" />
			<div className="hero__content page-shell">
				<p className="hero__eyebrow">Baundule / 0{activeIndex + 1}</p>
				<h1 id="hero-title">{activeSlide.title}</h1>
				<div className="hero__footer">
					<p>{activeSlide.subtitle}</p>
					<div className="hero__actions">
						<a className="button button--light" href={activeSlide.ctaLink}>
							{activeSlide.ctaText} <ArrowUpRight aria-hidden="true" size={16} />
						</a>
					</div>
				</div>
			</div>
			<div className="hero__indicators" role="group" aria-label="Choose a hero slide">
				{heroSlides.map((slide, index) => (
					<button
						key={slide.image}
						type="button"
						aria-label={`Show slide ${index + 1}: ${slide.title}`}
						aria-current={activeIndex === index ? "true" : undefined}
						onClick={() => setActiveIndex(index)}
					>
						<span />
					</button>
				))}
			</div>
			<a className="hero__scroll" href="#latest-drop"><span>Scroll</span><ArrowDown aria-hidden="true" size={16} /></a>
			<p className="hero__edition">ESTD. 2026 / {brand.tagline.toUpperCase()}</p>
		</section>
	);
}
