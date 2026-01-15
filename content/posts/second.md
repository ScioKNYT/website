---
title: Second
---
This is a standard second post.

Okay?

My website -: <https://website-29s.pages.dev/>

[`#include<iostream.h>`](https://website-29s.pages.dev/)

`{{ define "main" }}`

`<section>`

`  {{ with .Content }}`

`    <div class="prose">`

`      {{ . }}`

`    </div>`

`  {{ end }}`

`  <div class="posts-list">`

`    {{ range .Pages }}`

`      <a href="{{ .RelPermalink }}" class="post-link">`

`        <span class="post-title">{{ .Title }}</span>`

`        <span class="post-date">{{ .Date.Format "Jan 2" }}</span>`

`      </a>`

`    {{ end }}`

`  </div>`

`</section>`

`{{ end }}`


[``](https://website-29s.pages.dev/)
