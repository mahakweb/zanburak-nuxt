# Zanburak Nuxt Deploy - Configuration
# Server details for Nuxt SSR frontend

@{
    # -- SSH ------------------------------------------------------------------
    SshHost    = '87.107.1.15'
    SshPort    = 22
    SshUser    = 'root'
    SshPass    = 'Milad@4970'
    SshKeyPath = ''   # Optional: SSH private key path (password auth skipped if set)
    SshHostKey = @(
        'SHA256:dt+8V4O0YM56kBKJOEvw7DZ4r7o5oQqr8q3jnh33M2Y'   # RSA (plink/pscp)
    )

    # -- Server paths ---------------------------------------------------------
    RemoteDir     = '/var/www/zanburak-nuxt'
    RemoteZip     = '/tmp/zanburak-nuxt-output.zip'
    ZipName       = 'zanburak-nuxt-output.zip'
    NodePath      = '/usr/bin/node'
    NpmPath       = '/usr/bin/npm'
    WebUser       = 'www-data'
    WebGroup      = 'www-data'

    # -- Nuxt SSR Port --------------------------------------------------------
    NuxtPort      = 3000
    NuxtHost      = '127.0.0.1'

    # -- Service --------------------------------------------------------------
    ServiceName   = 'zanburak-nuxt'
}
