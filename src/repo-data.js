export class RepoConfig {
    constructor(repoUrl, projectName, packageName) {
        this.repoUrl = repoUrl
        this.projectName = projectName;
        this.packageName = packageName;
    }
}

export class SepackConfig {
    constructor([template]) {
        this.template = template;
    }
}

export class Template {
    constructor(name, url, dependencies) {
        this.name = name;
        this.url = url;
        this.dependencies = dependencies;
    }
}

export class Dependencies {
    constructor(name, file, deps, version) {
        this.name = name;
        this.file = file;
        this.deps = deps;
        this.version = version;
    }
}