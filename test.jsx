function renderTodo({ name, timestamp, content }) {
  return (
    <div class="card">
      <div class="card-content">
        <div class="media is-align-items-center">
          <div class="media-left">
            <figure class="image is-48x48">
              <img
                class="is-rounded"
                src="https://i.pravatar.cc/150?img=4"
                alt="Profile picture"
              />
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{name}</p>
          </div>
        </div>

        <div class="content">
          {content}
          <time datetime={timestamp}>{timestamp}</time>
        </div>
      </div>
    </div>
  );
}
