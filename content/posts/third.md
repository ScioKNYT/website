---
title: Third
---
The third post is here.

```
{{ define "main" }}
<section>
  {{ with .Content }}
    <div class="prose">
      {{ . }}
    </div>
  {{ end }}

  <div class="posts-list">
    {{ range .Pages }}
      <a href="{{ .RelPermalink }}" class="post-link">
        <span class="post-title">{{ .Title }}</span>
        <span class="post-date">{{ .Date.Format "Jan 2" }}</span>
      </a>
    {{ end }}
  </div>
</section>
{{ end }}

```
