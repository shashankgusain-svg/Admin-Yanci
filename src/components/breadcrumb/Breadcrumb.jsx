import Link from "next/link";
import React from "react";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex gap-2 items-center">
        {items.map((item, index) => (
          <li key={index} className="text-primary-6 font-semibold text-heading-5 first-of-type:text-label-1 first-of-type:text-black-13 first-of-type:font-normal">
            {item.link ? (
              <Link href={item.link}>
                <a>{item.name}</a>
              </Link>
            ) : (
              <span>{item.name}</span>
            )}
            {index < items.length - 1 ? <span className="ml-2">&gt;</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
