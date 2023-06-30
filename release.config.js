module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/common-config-loader',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/common-schemas',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/common-utils',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/common-validators',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'release/*.tgz',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'packages/common-config-loader',
          'packages/common-schemas',
          'packages/common-utils',
          'packages/common-validators',
        ],
      },
    ],
  ],
  preset: 'angular',
  branches: [{ name: 'master' }, { name: 'next', prerelease: true }],
};
